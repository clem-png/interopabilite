<?xml version='1.0' encoding="UTF-8" ?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" encoding="UTF-8" indent="yes"/>

    <xsl:template match="/">

        <xsl:element name="div">

            <xsl:apply-templates />

        </xsl:element>

        <xsl:apply-templates />

    </xsl:template>


    <xsl:template match="echeance">



        <xsl:choose>
            <xsl:when test="contains(@timestamp,'2024-12-11')">
                <xsl:element name="div">
                    <xsl:apply-templates select="@timestamp"/>
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
                    <xsl:value-of select=" format-number(. - 273.15,'####0.00')"/>
                </xsl:element>
            </xsl:when>
            <xsl:otherwise>
            </xsl:otherwise>
        </xsl:choose>


    </xsl:template>

    <xsl:template match="text()"/>
</xsl:stylesheet>