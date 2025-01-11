<?xml version='1.0' encoding="UTF-8" ?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" encoding="UTF-8" indent="yes"/>

    <xsl:param name="dateDemain"/>
    <xsl:param name="heureMatin"/>
    <xsl:param name="heureMidi"/>
    <xsl:param name="heureSoir"/>


    <xsl:template match="/">

        <xsl:element name="div">
            <xsl:attribute name="class">meteo</xsl:attribute>
            <xsl:apply-templates />
        </xsl:element>

    </xsl:template>


    <xsl:template match="echeance">


        <xsl:choose>
            <xsl:when test="contains(@timestamp, $heureMatin)">
                <xsl:element name="div">
                    <xsl:element name="h3">
                        Matin
                    </xsl:element>
                    <xsl:apply-templates select="@timestamp"/>
                    <xsl:element name="div">
                        <xsl:call-template name="aspectCiel"/>
                        <xsl:call-template name="vent"/>
                    </xsl:element>
                    <xsl:apply-templates select="temperature"/>
                </xsl:element>
            </xsl:when>
            <xsl:when test="contains(@timestamp, $heureMidi)">
                <xsl:element name="div">
                    <xsl:element name="h3">
                        Midi
                    </xsl:element>
                    <xsl:apply-templates select="@timestamp"/>
                    <xsl:element name="div">
                        <xsl:call-template name="aspectCiel"/>
                        <xsl:call-template name="vent"/>
                    </xsl:element>
                    <xsl:apply-templates select="temperature"/>
                </xsl:element>
            </xsl:when>
            <xsl:when test="contains(@timestamp, $heureSoir)">
                <xsl:element name="div">
                    <xsl:element name="h3">
                        Soir
                    </xsl:element>
                    <xsl:apply-templates select="@timestamp"/>
                    <xsl:element name="div">
                        <xsl:call-template name="aspectCiel"/>
                        <xsl:call-template name="vent"/>
                    </xsl:element>
                    <xsl:apply-templates select="temperature"/>
                </xsl:element>
            </xsl:when>
            <xsl:otherwise>
            </xsl:otherwise>

        </xsl:choose>

    </xsl:template>


    <xsl:template match="echeance/@timestamp">

        <xsl:element name="p">
            <xsl:value-of select="."/>
        </xsl:element>

    </xsl:template>

    <xsl:template match="echeance/temperature">

        <xsl:apply-templates select="level"/>
    </xsl:template>

    <xsl:template match="echeance/temperature/level">

        <xsl:choose>
            <xsl:when test="contains(@val,'2m')">
                <xsl:element name="p">
                    <xsl:value-of select=" format-number(. - 273.15,'####0')"/>°C
                    <xsl:comment>Température à 2 mètres</xsl:comment>
                </xsl:element>
            </xsl:when>
            <xsl:otherwise>
            </xsl:otherwise>
        </xsl:choose>


    </xsl:template>

    <xsl:template name="aspectCiel">
        <xsl:choose>
            <xsl:when test="pluie>'0' and risque_neige='oui'">
                <img src="imgMeteo/pluieNeige.png" alt="Neige et Pluie" />
            </xsl:when>
            <xsl:when test="pluie='0'">
                <img src="imgMeteo/pluie.png" alt="Pluie" />
            </xsl:when>
            <xsl:when test="risque_neige='oui'">
                <img src="imgMeteo/neige.png" alt="Neige" />
            </xsl:when>
            <xsl:otherwise>
                <img src="imgMeteo/soleil.png" alt="Soleil" />
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template name="vent">
        <xsl:choose>
            <xsl:when test="vent_moyen>='0' and vent_moyen&lt;'20'">
                <img src="imgMeteo/vagues.png" alt="vent calme" />
            </xsl:when>
            <xsl:when test="vent_moyen>='20' and vent_moyen&lt;50">
                <img src="imgMeteo/vent.png" alt="vent" />
            </xsl:when>
            <xsl:when test="vent_moyen>='50' and vent_moyen&lt;'89'">
                <img src="imgMeteo/rafales.png" alt="vent rafale" />
            </xsl:when>
            <xsl:when test="vent_moyen>='89' and vent_moyen&lt;'120'">
                <img src="imgMeteo/tempete-de-sable.png" alt="vent très fort (tempete)" />
            </xsl:when>
            <xsl:otherwise>

            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template match="text()"/>
</xsl:stylesheet>